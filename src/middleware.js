import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/auth/login" },
});

export const config = {
  matcher: ["/userDashboard/:path*", "/book-room/:path*", "/order-food/:path*"],
};
