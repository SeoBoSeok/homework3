import React, { Component } from "react";
import axios from "axios";

export default class App extends Component {
  state = {
    birthday: new Date().toISOString().slice(0, 10),
    data: "",
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

  render() {
    return (
      <div>
        <button onClick={this.getLottoNumber}>Lotto</button>
        <input
          name="birthday"
          type="date"
          onChange={this.handleChange}
          value={this.state.birthday}
        />
        <button onClick={this.getFortuneNumber}>Fortune</button>
        <button onClick={this.getBadRequest}>Bad</button>
        {this.state.data}
      </div>
    );
  }
}
