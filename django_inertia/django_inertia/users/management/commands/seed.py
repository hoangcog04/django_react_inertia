from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

User = get_user_model()


class Command(BaseCommand):
    help = "Seed database with test data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--users",
            type=int,
            default=0,
            help="Number of users to create (default: 10)",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all data before seeding",
        )
        parser.add_argument("--admin", action="store_true", help="Create admin user")

    def handle(self, *args, **options):
        users_count = options["users"]
        should_clear = options["clear"]
        create_admin = options["admin"]

        try:
            with transaction.atomic():
                if should_clear:
                    self.stdout.write(self.style.WARNING("Deleting old data..."))
                    User.objects.all().delete()
                    self.stdout.write(self.style.SUCCESS("✓ Deleted old data"))

                # Create admin user
                if create_admin:
                    self.stdout.write("Creating admin user...")
                    admin, created = User.objects.get_or_create(
                        username="admin",
                        defaults={
                            "email": "admin@example.com",
                            "name": "Admin User",
                            "is_staff": True,
                            "is_superuser": True,
                            "is_active": True,
                        },
                    )
                    if created:
                        admin.set_password("admin123")
                        admin.save()
                        self.stdout.write(
                            self.style.SUCCESS(
                                "✓ Created admin (username: admin, password: admin123)",
                            ),
                        )
                    else:
                        self.stdout.write(self.style.WARNING("⚠ Admin already exists"))

                # Create regular users
                self.stdout.write(f"Creating {users_count} users...")
                users_created = 0

                for i in range(1, users_count + 1):
                    username = f"user{i}"

                    # Skip if user already exists
                    if User.objects.filter(username=username).exists():
                        continue

                    user = User(
                        username=username,
                        email=f"user{i}@example.com",
                        name=f"Test User {i}",
                        is_active=True,
                    )
                    user.set_password("password123")
                    user.save()
                    users_created += 1

                    # Progress indicator
                    if users_created % 10 == 0:
                        self.stdout.write(f"  → Created {users_created} users...")

                self.stdout.write(
                    self.style.SUCCESS(f"✓ Created {users_created} users successfully"),
                )

                # Summary
                total_users = User.objects.count()
                self.stdout.write(
                    self.style.SUCCESS(
                        f"\n🎉 Completed! Total users: {total_users}",
                    ),
                )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error seeding data: {e!s}"))
            raise
