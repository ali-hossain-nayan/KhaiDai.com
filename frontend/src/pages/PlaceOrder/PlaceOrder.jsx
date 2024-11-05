import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, baseURL } = useContext(StoreContext)
  const navigate = useNavigate();



  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })



  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }))
  }


  // useEffect(() => {
  //   console.log(data)
  // }, [data])



  const handleSumit = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo['quantity'] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    // console.log(orderItems)

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2
    }
    let callAPI = await axios.post(baseURL + "/api/order/place", orderData, { headers: { token } });

    if (callAPI.data.success) {
      const { session_url } = callAPI.data;
      window.location.replace(session_url);
    } else {
      alert("Something went wrong!!")
    }
  }

  

  //if there is no logged in then we dont want to see the order page instead of go to cart..

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])



  return (
    <form onSubmit={handleSumit} className="place-order" >
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' />
          <input required type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' />
        </div>

        <input required type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' />
        <input required type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' />

        <div className="multi-fields">
          <input required type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' />
          <input required type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' />
        </div>

        <div className="multi-fields">
          <input required type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' />
          <input required type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' />
        </div>

        <input required type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' />
      </div>


      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'  >PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder