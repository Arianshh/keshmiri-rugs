from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render
from .models import Category, Signature, Rug


def home(request):
    featured_categories = (
        Category.objects
            .filter(is_active=True)
            .order_by("order", "id")[:4]
    )

    return render(
        request,
        "index.html",
        {
            "featured_categories": featured_categories,
        }
    )


def categories(request):
    categories_qs = Category.objects.filter(is_active=True)
    return render(request, "categories.html", {"categories": categories_qs})


def category_detail(request, slug):
    category = get_object_or_404(
        Category,
        slug=slug,
        is_active=True,
    )

    rugs_queryset = (
        Rug.objects
            .filter(
            signature__category=category,
            is_active=True,
        )
            .select_related(
            "signature",
            "signature__category",
        )
            .order_by(
            "order",
            "name",
        )
    )

    paginator = Paginator(
        rugs_queryset,
        8
    )

    page_number = request.GET.get("page")

    rugs = paginator.get_page(page_number)
    return render(
        request,
        "category_detail.html",
        {
            "category": category,
            "rugs": rugs,
        },
    )


def signature_detail(request, category_slug, signature_id):
    category = get_object_or_404(Category, slug=category_slug, is_active=True)
    signature = get_object_or_404(
        Signature,
        id=signature_id,
        category=category,
        is_active=True,
    )
    rugs = signature.rugs.filter(is_active=True)
    return render(request, "signature_detail.html", {
        "category": category,
        "signature": signature,
        "rugs": rugs,
    })


def about(request):
    return render(request, "about.html")
