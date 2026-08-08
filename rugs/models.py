from io import BytesIO
from pathlib import Path
from PIL import Image

from django.core.files.base import ContentFile
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    short_description = models.TextField(blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    card_image = models.ImageField(
        upload_to="categories/card/",
        blank=True,
        null=True,
        editable=False,
    )
    design_character = models.TextField(
        blank=True,
        help_text="One item per line. Appears under Design Character on the category page.",
    )
    features = models.TextField(
        blank=True,
        help_text="One feature per line. These appear on the category detail page.",
    )
    why_choose = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

    def make_card_image(self):
        if not self.image:
            return

        self.image.open()

        img = Image.open(self.image)
        img = img.convert("RGB")

        img.thumbnail((1000, 1000), Image.Resampling.LANCZOS)

        buffer = BytesIO()

        img.save(
            buffer,
            format="JPEG",
            quality=82,
            optimize=True,
        )

        filename = f"{Path(self.image.name).stem}_card.jpg"

        self.card_image.save(
            filename,
            ContentFile(buffer.getvalue()),
            save=False,
        )

    @property
    def design_character_list(self):
        source = getattr(self, "design_character", "") or getattr(self, "features", "")
        return [line.strip() for line in source.splitlines() if line.strip()]

    @property
    def feature_list(self):
        return self.design_character_list

    def save(self, *args, **kwargs):
        old_image = None

        if self.pk:
            old = Category.objects.filter(pk=self.pk).first()
            if old:
                old_image = old.image

        image_changed = self.image and self.image != old_image

        super().save(*args, **kwargs)

        if image_changed:
            self.make_card_image()
            super().save(update_fields=["card_image"])

        if self.image:
            img_path = self.image.path

            img = Image.open(img_path)
            img = img.convert("RGB")

            img.thumbnail((1400, 1400), Image.Resampling.LANCZOS)

            img.save(
                img_path,
                quality=75,
                optimize=True,
            )


class Signature(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="signatures",
    )

    code = models.CharField(max_length=80)

    title = models.CharField(
        max_length=120,
        blank=True,
        help_text="Customer-facing collection name. Example: Royal Medallion",
    )

    short_description = models.TextField(
        blank=True,
        help_text="Short text shown on the category page.",
    )

    cover_image = models.ImageField(
        upload_to="signatures/",
        blank=True,
        null=True,
    )

    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "code"]

    def __str__(self):
        return f"{self.category.name} - {self.display_title}"

    @property
    def display_title(self):
        return self.title or f"Signature {self.code}"


class Rug(models.Model):
    signature = models.ForeignKey(
        Signature,
        on_delete=models.CASCADE,
        related_name="rugs",
    )

    name = models.CharField(max_length=150)

    image = models.ImageField(
        upload_to="rugs/original/",
        blank=True,
        null=True,
    )

    card_image = models.ImageField(
        upload_to="rugs/card/",
        blank=True,
        null=True,
        editable=False,
    )
    detail_image = models.ImageField(
        upload_to="rugs/details/",
        blank=True,
        null=True,
    )
    detail_description = models.TextField(
        blank=True,
        help_text="Detailed description shown when the customer clicks View Detail.",
    )
    dimension = models.CharField(max_length=80, blank=True)
    warp = models.CharField(max_length=100, blank=True)
    pile = models.CharField(max_length=100, blank=True)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )

    is_available = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

    def make_card_image(self):
        if not self.image:
            return

        self.image.open()
        img = Image.open(self.image)
        img = img.convert("RGB")

        img.thumbnail((1200, 1600), Image.Resampling.LANCZOS)

        buffer = BytesIO()
        img.save(buffer, format="JPEG", quality=82, optimize=True)

        original_name = Path(self.image.name).stem
        new_name = f"{original_name}_card.jpg"

        self.card_image.save(
            new_name,
            ContentFile(buffer.getvalue()),
            save=False,
        )

    def save(self, *args, **kwargs):
        old_image = None

        if self.pk:
            old = Rug.objects.filter(pk=self.pk).first()
            if old:
                old_image = old.image

        image_changed = self.image and self.image != old_image

        if image_changed:
            self.make_card_image()

        super().save(*args, **kwargs)
