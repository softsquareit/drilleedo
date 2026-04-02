import os

files = [
    '/home/softsquareit/Desktop/drilledov2/templates/home/for_professionals.html.twig',
    '/home/softsquareit/Desktop/drilledov2/templates/home/about.html.twig'
]

replacements = {
    'fas fa-rocket': 'ph-bold ph-rocket-launch',
    'feather-arrow-right': 'ph-bold ph-arrow-right',
    'feather-check-circle': 'ph-bold ph-check-circle',
    'feather-users': 'ph-bold ph-users',
    'feather-star': 'ph-bold ph-star',
    '>👥<': '><i class="ph-bold ph-users text-white"></i><',
    '>📋<': '><i class="ph-bold ph-clipboard-text text-white"></i><',
    '>💰<': '><i class="ph-bold ph-currency-dollar text-white"></i><',
    '>⚡<': '><i class="ph-bold ph-lightning text-white"></i><',
    'fas fa-hard-hat': 'ph-bold ph-hard-hat',
    'fas fa-clipboard-list': 'ph-bold ph-clipboard-text',
    'fas fa-dollar-sign': 'ph-bold ph-currency-dollar',
    'fas fa-star': 'ph-bold ph-star',
    'fas fa-list-ol': 'ph-bold ph-list-numbers',
    'feather-user-plus': 'ph-bold ph-user-plus',
    'feather-edit-2': 'ph-bold ph-pencil-simple',
    'feather-shield': 'ph-bold ph-shield-check',
    'feather-briefcase': 'ph-bold ph-briefcase',
    'fas fa-gem': 'ph-bold ph-diamond',
    'feather-trending-up': 'ph-bold ph-trend-up',
    'feather-layers': 'ph-bold ph-stack',
    'feather-message-circle': 'ph-bold ph-chat-circle',
    'feather-bar-chart-2': 'ph-bold ph-chart-bar',
    'feather-check': 'ph-bold ph-check',
    'fas fa-bolt': 'ph-bold ph-lightning',
    'feather-target': 'ph-bold ph-crosshair',
    'feather-command': 'ph-bold ph-sliders',
    'feather-x': 'ph-bold ph-x',
    'fas fa-quote-left': 'ph-bold ph-quotes',
    'fas fa-tag': 'ph-bold ph-tag',
    
    # About us replacements
    'feather-info': 'ph-bold ph-info',
    'fas fa-users': 'ph-bold ph-users',
    'fas fa-check-circle': 'ph-bold ph-check-circle',
    'fas fa-history': 'ph-bold ph-clock-counter-clockwise',
    'feather-eye': 'ph-bold ph-eye',
    'feather-award': 'ph-bold ph-medal',
    'feather-zap': 'ph-bold ph-lightning',
    'fas fa-bullseye': 'ph-bold ph-crosshair',
    'feather-file-text': 'ph-bold ph-file-text',
    'feather-clock': 'ph-bold ph-clock',
    'feather-headphones': 'ph-bold ph-headphones',
    'feather-help-circle': 'ph-bold ph-question'
}

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

print(f"Replaced icons in {len(files)} files.")
