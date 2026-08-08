Dynamic Category Page Sections
==============================

This version makes these category page sections editable in Django admin:

1. Design Character
   - Admin field: design_character
   - Write one item per line.
   - Displayed as the bullet list in the Design Character box.

2. Why Choose It?
   - Admin field: why_choose
   - Write the paragraph shown in the Why Choose It? box.

After replacing the project files, run:

    python manage.py makemigrations rugs
    python manage.py migrate

If this ZIP already includes a migration file, just run:

    python manage.py migrate

The UI/UX was not changed.
