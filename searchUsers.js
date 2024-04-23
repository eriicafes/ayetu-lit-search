import "./styles.css"

import { LitElement, css, html } from "lit"

class SearchUsers extends LitElement {
  static styles = css`
    .container {
      display: flex;
      flex-direction: column;
    }

    .container > input {
      padding: 0 12px;
      height: 40px;
      border-radius: 12px;
      border: 1px solid #cecece;
    }

    .container > input:focus {
      border-color: red;
    }

    .user-item-list {
      list-style-type: none;
      padding: 0 4px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .user-item {
      background-color: #f7f7f7;
      border: 1px solid transparent;
      padding: 20px 12px;
      border-radius: 8px;
      font-size: 14px;
    }

    .user-item:hover {
      border-color: #cecece;
    }

    .results > p {
      padding: 24px 12px;
      font-weight: 500;
      text-align: center;
    } 
  `

  static properties = {
    _users: { type: Array, state: true }
  }

  constructor() {
    super()
    this._users = [{name: "Bobby"}]
  }

  render() {
    return html`
    <div class="container">
      <input onchange="this.updateSearch()" type="search" name="search" placeholder="Search users" />
      <ul class="user-item-list">
        <li class="user-item">Apple</li>
        <li class="user-item">Orange</li>
      </ul>
      <div class="results">
        <p>No users found</p>
      </div>
    </div>
    `
  }
}

customElements.define("search-users", SearchUsers)
