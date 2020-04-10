import React, { Component } from "react";
import axios from "axios";
import { setupCache } from "axios-cache-adapter";

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

const api = axios.create({
  adapter: cache.adapter,
});

export default class App extends Component {
  state = {
    birthday: new Date().toISOString().slice(0, 10),
    data: "",
    isLoading: false,
  };

  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({
      birthday: e.target.value,
    });
  };

  getLottoNumber = () => {
    axios
      .get("http://askat.me:8000/api/lotto")
      .then((response) => {
        // console.log(response);
        this.setState({
          data: response.data.join(" "),
        });
      })
      .catch((e) => {
        console.error(e);
        window.alert(e.message);
      });
  };

  getFortuneNumber = () => {
    if (this.state.birthday === "") {
      window.alert("날짜를 입력해주세요.");
      return;
    }
    axios
      .get(`http://askat.me:8000/api/fortune/${this.state.birthday}`)
      .then((response) => {
        console.log(response);
        this.setState({ data: response.data });
      })
      .catch((e) => {
        console.error(e);
        window.alert(e.message);
      });
  };

  getBadRequest = () => {
    axios("http://askat.me:8000/api/bad")
      .then((response) => {
        console.log(response);
        this.setState({
          data: response.data,
        });
      })
      .catch((e) => {
        console.error(e);
        window.alert(e.message);
      });
  };

  getCacheData = () => {
    this.setState({
      isLoading: true,
    });
    // Send a GET request to some REST api
    api({
      url: "http://askat.me:8000/api/slow	",
      method: "get",
    }).then(async (response) => {
      // Do something fantastic with response.data \o/
      console.log("Request response:", response);

      // Interacting with the store, see `localForage` API.
      const length = await cache.store.length();

      console.log("Cache store length:", length);

      this.setState({
        isLoading: false,
      });
    });
  };

  render() {
    return (
      <div>
        {this.state.isLoading && <div>Loading...</div>}
        <button onClick={this.getLottoNumber}>Lotto</button>
        <input
          name="birthday"
          type="date"
          onChange={this.handleChange}
          value={this.state.birthday}
        />
        <button onClick={this.getFortuneNumber}>Fortune</button>
        <button onClick={this.getBadRequest}>Bad</button>
        <button onClick={this.getCacheData}>Cache Data</button>
        {this.state.data}
      </div>
    );
  }
}
