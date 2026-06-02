import java.sql.*;
public class DBRoleDebug {
  public static void main(String[] args) throws Exception {
    if (args.length < 1) {
      System.err.println("Usage: DBRoleDebug <email>");
      System.exit(2);
    }
    String email = args[0];
    String url = "jdbc:postgresql://ep-misty-rain-apff0rak-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    String user = "neondb_owner";
    String pass = "npg_LNe3xVF1DovC";
    try (Connection c = DriverManager.getConnection(url, user, pass);
         PreparedStatement ps = c.prepareStatement(
           "SELECT role, length(role) as len, substring(role from 1 for 1) as first, ascii(substring(role from 1 for 1)) as ascii_first FROM users WHERE email = ?")) {
      ps.setString(1, email);
      try (ResultSet rs = ps.executeQuery()) {
        if (!rs.next()) {
          System.out.println("<no rows>");
          return;
        }
        String role = rs.getString("role");
        int len = rs.getInt("len");
        String first = rs.getString("first");
        int ascii = rs.getInt("ascii_first");
        System.out.println("role='" + role + "' length=" + len + " first='" + first + "' ascii=" + ascii);
      }
    }
  }
}
