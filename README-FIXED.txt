Fixed Django project for Keshmiri Rugs.

What was fixed:
- templates are directly in BASE_DIR/templates
- static assets are in BASE_DIR/static/assets
- settings.py points to templates/static/media correctly
- config/urls.py routes / to rugs.urls
- categories are dynamic from the Category model
- reference UI/assets preserved from the provided reference ZIP
- venv, .idea, __pycache__, and db.sqlite3 are not included

After extracting:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_categories
python manage.py runserver

Endpoints:
http://127.0.0.1:8000/
http://127.0.0.1:8000/categories/
http://127.0.0.1:8000/admin/
