from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("categories/", views.categories, name="categories"),
    path("categories/<slug:slug>/", views.category_detail, name="category_detail"),
    path(
        "categories/<slug:category_slug>/signatures/<int:signature_id>/",
        views.signature_detail,
        name="signature_detail",
    ),
    path("about/", views.about, name="about"),

]
