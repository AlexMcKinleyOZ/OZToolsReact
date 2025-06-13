from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from docx import Document
import tempfile
import os

app = Flask(__name__)
CORS(app)

def docx_to_html(docx_path):
    doc = Document(docx_path)
    new_html_content = ""
    set_tag = None
    next_tag = None

    h1_tag = ['h1', 'class="h2"']
    p_title = ['p', 'class="entry__txt bold"']
    p_tag = ['p', '']

    def get_font_size(run):
        if run.font.size:
            return run.font.size.pt
        return None

    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            if set_tag is not None:
                new_html_content += f'</{set_tag[0]}>\n'
            next_tag = None
            set_tag = None
            continue

        font_sizes = [get_font_size(run) for run in para.runs if get_font_size(run)]
        font_size = max(font_sizes) if font_sizes else 11

        first_bold = False
        for run in para.runs:
            if run.text.strip():
                first_bold = run.bold is True
                break

        full_text = para.text

        if first_bold and font_size <= 11:
            next_tag = p_title
        elif first_bold and font_size >= 12:
            next_tag = h1_tag
        else:
            next_tag = p_tag

        if set_tag is None:
            full_text = f'<{next_tag[0]} {next_tag[1]}>{full_text}'
            set_tag = next_tag
            new_html_content += full_text
        elif set_tag != next_tag:
            full_text = f'</{set_tag[0]}>\n<{next_tag[0]} {next_tag[1]}>{full_text}'
            set_tag = next_tag
            new_html_content += full_text
        else:
            new_html_content += full_text

    if set_tag:
        new_html_content += f'</{set_tag[0]}>\n'

    return new_html_content

@app.route('/convert', methods=['POST'])
def convert():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if not file.filename.endswith('.docx'):
        return jsonify({'error': 'Invalid file type'}), 400

    with tempfile.TemporaryDirectory() as tmpdirname:
        input_path = os.path.join(tmpdirname, 'input.docx')
        output_path = os.path.join(tmpdirname, 'converted.html')
        file.save(input_path)

        try:
            html_body = docx_to_html(input_path)

            full_html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Auto Converted</title>
    <style>
        body {{ font-family: 'Noto Sans', sans-serif; }}
        p {{ font-size: 16px; font-weight: 400; line-height: 1.8; }}
        .h2 {{ font-size: 36px; font-weight: 700; line-height: 1.4; }}
        .bold {{ font-weight: bold; }}
    </style>
</head>
<body>
{html_body}
</body>
</html>
"""
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(full_html)

            return send_file(output_path, as_attachment=True, download_name='converted.html')
        except Exception as e:
            print("Conversion error:", e)
            return jsonify({'error': 'Conversion failed'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
