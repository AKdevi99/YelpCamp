

    document.addEventListener("DOMContentLoaded", () => {
        const alerts = document.querySelectorAll('.alert');

        alerts.forEach(alert => {
            gsap.to(alert, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });

            setTimeout(() => {
                gsap.to(alert, { opacity: 0, y: -30, duration: 0.6, ease: "power2.in", onComplete: () => alert.remove() });
            }, 5000);
        });

        document.querySelectorAll('.btn-close').forEach(btn => {
            btn.addEventListener('click', function() {
                let alert = this.parentElement;
                gsap.to(alert, { opacity: 0, y: -30, duration: 0.4, ease: "power2.in", onComplete: () => alert.remove() });
            });
        });
    });

