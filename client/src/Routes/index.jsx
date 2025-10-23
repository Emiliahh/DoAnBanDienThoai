import App from '../App';
import LoginUser from '../Pages/LoginUser/LoginUser';
import RegisterUser from '../Pages/RegisterUser/RegisterUser';
import DetailProduct from '../Pages/DetailProduct/DetailProduct';
import Category from '../Pages/Category/Category';
import InfoUser from '../Pages/InfoUser/index';
import Cart from '../Pages/Cart/Cart';
import MainLayout from '../Pages/Admin/MainLayout';
import Payments from '../Pages/Payments/Payments';
import ForgotPassword from '../Pages/ForgotPassword/ForgotPassword';
import VerifyAccount from '../Pages/VerifyAccount/VerifyAccount';
const publicRoutes = [
    { path: '/', component: <App /> },
    { path: '/login', component: <LoginUser /> },
    { path: '/register', component: <RegisterUser /> },
    { path: '/product/:id', component: <DetailProduct /> },
    { path: '/category/:id', component: <Category /> },
    { path: '/info-user/:id', component: <InfoUser /> },
    { path: '/cart', component: <Cart /> },
    { path: '/admin', component: <MainLayout /> },
    { path: '/payment/:id', component: <Payments /> },
    { path: '/forgot-password', component: <ForgotPassword /> },
    { path: '/verify-account', component: <VerifyAccount /> },
];

export { publicRoutes };
