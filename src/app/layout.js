import "./globals.css";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Whatsapp from "./component/Whatsapp";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  cz-shortcut-listen="true">
        <Navbar/>
        {children}
        <Whatsapp/>
        <Footer/>
        </body>
    </html>
  );
}
