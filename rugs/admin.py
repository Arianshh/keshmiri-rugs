from django.contrib import admin
from .models import Category, Signature, Rug


class RugInline(admin.TabularInline):
    model = Rug
    extra = 1
    fields = (
        "name",
        "image",
        "detail_image",
        "detail_description",
        "dimension",
        "warp",
        "pile",
        "price",
        "is_available",
        "order",
        "is_active",
    )


class SignatureInline(admin.TabularInline):
    model = Signature
    extra = 1
    fields = (
        "code",
        "title",
        "short_description",
        "cover_image",
        "order",
        "is_active",
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order", "is_active")
    list_editable = ("order", "is_active")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "short_description", "description")
    list_filter = ("is_active",)
    inlines = [SignatureInline]


@admin.register(Signature)
class SignatureAdmin(admin.ModelAdmin):
    list_display = ("display_title", "code", "category", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("code", "title", "short_description", "category__name")
    list_filter = ("category", "is_active")
    inlines = [RugInline]


@admin.register(Rug)
class RugAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "signature",
        "category",
        "dimension",
        "price",
        "is_available",
        "order",
        "is_active",
    )

    list_editable = (
        "price",
        "is_available",
        "order",
        "is_active",
    )

    search_fields = (
        "name",
        "signature__code",
        "signature__category__name",
        "detail_description",
    )

    list_filter = (
        "signature__category",
        "signature",
        "is_available",
        "is_active",
    )

    fieldsets = (
        ("Collection", {
            "fields": (
                "signature",
                "name",
            )
        }),
        ("Images", {
            "fields": (
                "image",
                "detail_image",
            )
        }),
        ("Rug Details", {
            "fields": (
                "dimension",
                "warp",
                "pile",
                "price",
                "detail_description",
            )
        }),
        ("Publishing", {
            "fields": (
                "is_available",
                "order",
                "is_active",
            )
        }),
    )

    def category(self, obj):
        return obj.signature.category
