import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import * as authApi from '../api/auth'
import * as productApi from "../api/product"
export const Home = () => {
    const createProductCard = async (e) => {
        e.preventDefault();
        if (window.confirm('Do you want to add this Product..?')) {
            const jwtRes = await authApi.verifyAuthSession()
            if (jwtRes) {
                var data = {
                    product_name: productName,
                    product_desc: productDesc,
                    product_price: parseInt(productPrice),
                    product_qty: parseInt(productQty),
                    product_mfg: productMfg,
                    product_expiry: productExp
                }

                await productApi.addProductCard(data)
                    .then(res => {
                        console.log(res)
                        if (res.data.status === 'failed') {
                            if (res.data.error.name === 'JsonWebTokenError') {
                                alert('User Token Expired. Please log in again')
                                localStorage.clear();
                                //window.location = process.env.PUBLIC_URL + '/auth/login'
                            } else {
                                alert('Please try again..!')

                            }
                        } else {
                            if (res.data.msg === 'invalid input fields') {
                                alert('Please check the the fields entered..!')

                            } 
                            else {
                                alert('Product added..!')
                                window.location.reload();
                            }
                        }
                    })
                    .catch(err => {
                        alert('Please try again..!')
                    })
            }
        }
    }
//array
    const [p, setP] = useState([])
    //search
    const [s, setS] = useState("")
    const productNames = p.filter((n) => n.product_name.toLowerCase().includes(s.toLowerCase()));

    const callFetchProductCards = async () => {
        await productApi.fetchProductCards()
            .then(res => {
                console.log(res)
                if (res.data.status === 'success') {
                    setP(res.data.data.cards)
                } else if (res.data.error.name === 'JsonWebTokenError') {
                    alert('User Token Expired. Please log in again')
                    localStorage.clear();
                    //window.location = process.env.PUBLIC_URL + '/auth/login'
                } else {
                    alert('User Token Expired. Please log in again')
                    localStorage.clear();
                    //window.location = process.env.PUBLIC_URL + '/auth/login'
                }
            })
            .catch(err => {
                alert('User Token Expired. Please log in again')
                localStorage.clear();
                // window.location = process.env.PUBLIC_URL + '/auth/login'
            })
    }

    useEffect(() => {
        const fetchData = async () => {
            const jwtRes = await authApi.verifyAuthSession();
            if (jwtRes) {
                await callFetchProductCards();
            }
        };

        fetchData();
    }, [p.length]);

    useEffect(() => {
        const today = new Date();
        p.map((item) => {
          console.log(item.product_name);
          console.log(new Date(item.product_expiry));
          console.log(today);
          const differenceMs = new Date(item.product_expiry).getTime() - today.getTime();
      
          // Convert milliseconds to days
          const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
          console.log(differenceDays);
      
          if (differenceDays <= 10 && differenceDays >= 0) {
            alert(`${item.product_name} will expire in ${differenceDays} days!`);
          }
        });
      }, [p.length]);
      
    const [productName, setProductName] = useState("");
    const [productDesc, setProductDesc] = useState("")
    const [productPrice, setProductPrice] = useState(0);
    const [productQty, setProductQty] = useState(0);
    const [productMfg, setProductMfg] = useState("");
    const [productExp, setProductExp] = useState("");

    return (
        <div>

            <div className='home-flex'>
                <div className='product-form'>
                    
                    <h2>Add New Product</h2>
                    <Form
                        onSubmit={
                            createProductCard
                        }
                    >
                        {/* search */}
                        <Form.Control placeholder="search" onChange={(e) => setS(e.target.value)} value={s} />
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Product name</Form.Label>
                            <Form.Control type="text" placeholder="Enter product name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Product Desc</Form.Label>
                            <Form.Control type="text" placeholder="Enter product desc"
                                value={productDesc}
                                onChange={(e) => setProductDesc(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Product Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter product price"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Product Quantity</Form.Label>
                            <Form.Control type="number" placeholder="Enter product quantity"
                                value={productQty}
                                onChange={(e) => setProductQty(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mfg Date</Form.Label>
                            <Form.Control type="text" placeholder="Enter product quantity"
                                value={productMfg}
                                onChange={(e) => setProductMfg(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control type="text" placeholder="Enter product quantity"
                                value={productExp}
                                onChange={(e) => setProductExp(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            ADD
                        </Button>
                    </Form>
                </div>
                <div className='product-flex'>
                    {productNames.map((p) => (
                        <Card style={{ width: '18rem' }} className='product-card' key={p.id}>
                            <Card.Body className='card-body'>
                                <div>
                                    <Card.Title>{p.product_name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Rs. {p.product_price}</Card.Subtitle>
                                    <Card.Text>
                                        {p.product_desc}
                                    </Card.Text>
                                    <Card.Text className='p-dates'>
                                        <span>Qty {p.product_qty}</span>
                                        <span>Mfg date: {new Date(p.product_mfg).toISOString().split("T")[0]}</span>
                                        <span>Expiry date: {new Date(p.product_expiry).toISOString().split("T")[0]}</span>
                                    </Card.Text>
                                </div>
                                <div className='card-design'>

                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    )
}