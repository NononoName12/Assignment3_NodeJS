import "./App.css";
import "./css/custom.css";
import "./css/style.default.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./Share/Footer/Footer";
import Header from "./Share/Header/Header";
import Home from "./Home/Home";
import Detail from "./Detail/Detail";
import Cart from "./Cart/Cart";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import MainHistory from "./History/MainHistory";
import DetailHistory from "./History/DetailHistory";
// import Checkout from "./Checkout/Checkout";
// import History from "./History/History";
import Shop from "./Shop/Shop";
import Checkout from "./Checkout/Checkout";
import Chat from "./Share/Chat/Chat";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />{" "}
          <Route path="/detail/:id" component={Detail} />{" "}
          <Route path="/cart" component={Cart} />{" "}
          <Route path="/signin" component={SignIn} />{" "}
          <Route path="/signup" component={SignUp} />{" "}
          <Route path="/shop" component={Shop} />
        </Switch>{" "}
      </BrowserRouter> */}

      <BrowserRouter>
        <UserProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/history" element={<MainHistory />} />
            <Route path="/history/:id" element={<DetailHistory />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>

      <Chat />

      <Footer />
    </div>
  );
}

export default App;
