import java.sql.*;
public class DBQuery {
  public static void main(String[] args) throws Exception {
    if (args.length < 1) {
      System.err.println("Usage: java DBQuery <email>");
      System.exit(2);
    }
    String url = "jdbc:postgresql://ep-misty-rain-apff0rak-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    String user = "neondb_owner";
    String pass = "npg_LNe3xVF1DovC";
    String email = args[0];
    try (Connection c = DriverManager.getConnection(url, user, pass);
         PreparedStatement ps = c.prepareStatement("SELECT email, role, seller_approved FROM users WHERE email=?")) {
      ps.setString(1, email);
      try (ResultSet rs = ps.executeQuery()) {
        boolean any = false;
        while (rs.next()) {
          any = true;
          String e = rs.getString(1);
          String r = rs.getString(2);
          boolean s = rs.getBoolean(3);
          System.out.println(e + "\t" + r + "\t" + s);
        }
        if (!any) System.out.println("<no rows>");
      }
    }
  }
}
