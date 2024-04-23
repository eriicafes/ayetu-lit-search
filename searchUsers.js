import "./styles.css";

import { LitElement, css, html } from "lit";
import { debounce } from "./utils";

class SearchUsers extends LitElement {
  static styles = css`
    .container {
      display: flex;
      flex-direction: column;
    }

    .search-box {
      height: 40px;
      display: flex;
      align-items: center;
      border: 1px solid #cecece;
      border-radius: 12px;
      overflow: hidden;
    }
    .search-box:focus-within {
      border-color: #cecccc;
    }
    .search-box svg {
      width: 20px;
      height: 20px;
      color: #cecece;
      padding: 0 8px
    }
    .search-box input {
      border: none;
      height: 100%;
      flex-grow: 1;
    }
    .search-box input:focus {
      outline: none;
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

    .empty {
      padding: 24px 12px;
      font-weight: 400;
      text-align: center;
    }
  `;

  static properties = {
    _users: { state: true },
    _search: { state: true },
  };

  constructor() {
    super();
    this._users = [{ name: "Bobby" }];
    this._filtered_users = [...this._users];

    this.searchUsers = debounce(this.searchUsers.bind(this), 500);
  }

  render() {
    return html`
      <div class="container">
        <div class="search-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            value="${this._search}"
            @input="${this.handleSearch}"
            type="search"
            name="search"
            placeholder="Search users"
          />
        </div>
        <div class="search-results">${this.renderUsers()}</div>
      </div>
    `;
  }

  renderUsers() {
    if (!this._filtered_users.length) {
      return html` <p class="empty">No users found</p> `;
    }
    return html` <ul class="user-item-list">
      ${this._filtered_users.map(
        (user) => html`<li class="user-item">${user.name}</li>`
      )}
    </ul>`;
  }

  handleSearch(e) {
    this._search = e.target.value;
    this.searchUsers(this._search);
  }

  searchUsers(search) {
    console.log("searching...", search);
    this._filtered_users = this._users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
    this.requestUpdate("_filtered_users");
  }
}

customElements.define("search-users", SearchUsers);
