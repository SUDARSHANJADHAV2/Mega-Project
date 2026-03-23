import os
import re

dir_path = "c:\\Users\\sudar\\Desktop\\GitHub Repositories\\Mega-Project\\frontend\\src"

for root, _, files in os.walk(dir_path):
    for f in files:
        if f.endswith('.jsx') or f.endswith('.js'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # For template literals like `http://localhost:8000/api/...`
            new_content = re.sub(r'`http://localhost:8000(/.*?)`', r'`${import.meta.env.VITE_API_URL || "http://localhost:8000"}\1`', content)
            
            # For api.js baseURL
            if f == 'api.js':
                new_content = new_content.replace("'http://localhost:8000'", "import.meta.env.VITE_API_URL || 'http://localhost:8000'")
            
            if content != new_content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated {f}")
