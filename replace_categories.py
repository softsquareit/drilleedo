import os
import re

for root, _, files in os.walk('templates'):
    if 'admin' in root:
        continue
    for file in files:
        if file.endswith('.twig'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace '.category.name' or 'category.name' but only when it refers to the entity property
            # Match boundary, 'category', optional '?', '.name', boundary
            new_content = re.sub(r'(\bcategory\??)\.name\b', r'\1.localizedTitle(app.request.locale)', content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {path}")
