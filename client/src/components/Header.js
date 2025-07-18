import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ROUTES from '../navigations/Routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const[user,setUser]=useState({id:null,role:null});
  const navigate=useNavigate();

  useEffect(() => {
  const checkUser = () => {
    let id = localStorage.getItem("id");
    let role = localStorage.getItem("role");
    if (id) {
      setUser({ id, role });
    } else {
      setUser({ id: null, role: null });
    }
  };

  checkUser();

  window.addEventListener("login-status-changed", checkUser);

  return () => {
    window.removeEventListener("login-status-changed", checkUser);
  };
}, []);


// useEffect(()=>{
// let id=localStorage.getItem("id");
// let role=localStorage.getItem("role");
// if(id)
//   setUser({id:id,role:role});
//   },[])
  
function renderMenu(){
  if(user?.role=="admin")
  {
    return(
    
  <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
      <Link to={ROUTES.universityAdmin.name} className='nav-link'>University Management</Link>
      </li>
       <li class="nav-item active">
      <Link to={ROUTES.universityAdmin.name} className='nav-link'>User Management</Link>
     </li>
       <li class="nav-item active">
      <Link to={ROUTES.universityAdmin.name} className='nav-link'>Order Management</Link>
      </li>
      </ul>
    )
  }
  else{
    return(
       <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
      <Link to={ROUTES.home.name} className='nav-link'>Home</Link>
      </li>
       <li class="nav-item active">
      <Link to={ROUTES.about.name} className='nav-link'>About</Link>
     </li>
       <li class="nav-item active">
      <Link to={ROUTES.contact.name} className='nav-link'>Contact</Link>
      </li>
       <li class="nav-item active">
      <Link to={ROUTES.support.name} className='nav-link'>Support</Link>
      </li>
        <li className="nav-item active">
            <Link to={ROUTES.cart.name} className="nav-link">
              <FontAwesomeIcon icon={faShoppingCart} /> 
            </Link>
          </li>
     
      </ul>
      
    )
  
  }
  
}

function renderButtons(){
  if(user?.id){
    return(
      <a className="btn btn-outline-danger my-2 my-sm-0" 
//       onClick={()=>{
// localStorage.clear();
// navigate(ROUTES.login.name);
//  }}     
onClick={() => {
  localStorage.clear();
  setUser({ id: null, role: null });
  navigate(ROUTES.login.name);
  window.dispatchEvent(new Event("login-status-changed"));
}}
>Logout</a>
    );
}else{
  return(
  <>
  <Link to={ROUTES.register.name} className="btn btn-outline-success my-2 my-sm-0">
      Register</Link>
   <Link to={ROUTES.login.name} className="btn btn-outline-success my-2 my-sm-0">
   Login</Link>
  </>
  );
}
}

  return (
    <>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    {renderMenu()}
    {renderButtons()}
  </div>
</nav>
    </>
  )
}


export default Header