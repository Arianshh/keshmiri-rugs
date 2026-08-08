Keshmiri Rugs Django Conversion Files
====================================

This ZIP contains the conversion pieces only:

- templates/index.html
- templates/categories.html
- templates/category_detail.html
- static/assets/
- rugs/ Django app

It does not include manage.py or config/, because you said those Django parts already exist.

Copy these folders into your Django project root:
  templates/
  static/
  rugs/

settings.py needs:
  INSTALLED_APPS += ["rugs"]
  TEMPLATES[0]["DIRS"] = [BASE_DIR / "templates"]
  STATIC_URL = "static/"
  STATICFILES_DIRS = [BASE_DIR / "static"]
  MEDIA_URL = "media/"
  MEDIA_ROOT = BASE_DIR / "media"

project urls.py needs:
  from django.conf import settings
  from django.conf.urls.static import static
  from django.contrib import admin
  from django.urls import include, path

  urlpatterns = [
      path("admin/", admin.site.urls),
      path("", include("rugs.urls")),
  ]

  if settings.DEBUG:
      urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

Run:
  python manage.py makemigrations rugs
  python manage.py migrate
  python manage.py createsuperuser
  python manage.py seed_categories
  python manage.py runserver

The UI/CSS/assets are preserved. Categories are now database-driven.
