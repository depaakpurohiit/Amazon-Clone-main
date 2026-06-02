import java.sql.*;
public class DBInspect {
  public static void main(String[] args) throws Exception {
    String url = "jdbc:postgresql://ep-misty-rain-apff0rak-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    String user = "neondb_owner";
    String pass = "npg_LNe3xVF1DovC";
    try (Connection c = DriverManager.getConnection(url, user, pass);
         PreparedStatement ps = c.prepareStatement(
           "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position")) {
      try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
          System.out.println(rs.getString(1) + "\t" + rs.getString(2) + "\t" + rs.getString(3) + "\t" + rs.getString(4));
        }
      }
    }
  }
}
