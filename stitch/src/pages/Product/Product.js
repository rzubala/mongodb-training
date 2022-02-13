import React, { Component } from 'react';
import { ObjectId } from 'bson'
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'


import './Product.css';

class ProductPage extends Component {
  state = { isLoading: true, product: null };

  componentDidMount() {
    // axios
    //   .get('http://localhost:3100/products/' + this.props.match.params.id)
    //   .then(productResponse => {
    //     this.setState({ isLoading: false, product: productResponse.data });
    //   })
    //   .catch(err => {
    //     this.setState({ isLoading: false });
    //     console.log(err);
    //     this.props.onError('Loading the product failed. Please try again later');
    //   });

      const mongodb = Stitch.defaultAppClient.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
      mongodb.db("shop").collection("products").findOne({_id: new ObjectId(this.props.match.params.id) })
        .then(result => {
          console.log(result);
          result._id = result._id.toString();
          result.price = result.price.toString()
          this.setState({ isLoading: false, product: result });
        })
        .catch(err => {
          this.setState({ isLoading: false });
          console.log(err);
          this.props.onError('Loading the product failed. Please try again later');
        })
  
  }

  render() {
    let content = <p>Is loading...</p>;

    if (!this.state.isLoading && this.state.product) {
      content = (
        <main className="product-page">
          <h1>{this.state.product.name}</h1>
          <h2>{this.state.product.price}</h2>
          <div
            className="product-page__image"
            style={{
              backgroundImage: "url('" + this.state.product.image + "')"
            }}
          />
          <p>{this.state.product.description}</p>
        </main>
      );
    }
    if (!this.state.isLoading && !this.state.product) {
      content = (
        <main>
          <p>Found no product. Try again later.</p>
        </main>
      );
    }
    return content;
  }
}

export default ProductPage;
