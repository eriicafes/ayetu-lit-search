import "./styles.css";

import { LitElement, css, html } from "lit";
import { debounce } from "./utils";

class SearchUsers extends LitElement {
  static styles = css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    * {
      margin: 0;
    }

    .container {
      display: flex;
      flex-direction: column;
    }

    .search-box {
      height: 52px;
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1px solid #e9e9e9;
      border-radius: 16px;
      overflow: hidden;
      padding: 0 12px;
      transition: border-color 0.2s ease;
    }
    .search-box:focus-within {
      border-color: #cecccc;
    }
    .search-box svg {
      width: 20px;
      height: 20px;
      color: #cecece;
    }
    .search-box input {
      border: none;
      height: 100%;
      flex-grow: 1;
      font-size: 14px;
    }
    .search-box input:focus {
      outline: none;
    }

    .info {
      font-size: 12px;
      text-align: center;
      padding: 12px 0;
      color: #cecece;
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
    this._users = [];
    this._state = "idle";

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
        <p class="info">${this._state === "loading" ? "Loading..." : "Search"}</p>
        <div class="search-results">${this.renderUsers()}</div>
      </div>
    `;
  }

  renderUsers() {
    if (this._state === "error") {
      return html` <p class="empty">Something went wrong!</p> `;
    }
    if (!this._users.length) {
      return html` <p class="empty">No users found</p> `;
    }
    return html` <ul class="user-item-list">
      ${this._users.map(
        (user) => html`<li class="user-item">${user.name}</li>`
      )}
    </ul>`;
  }

  handleSearch(e) {
    this._search = e.target.value;
    this.searchUsers(this._search);
  }

  async searchUsers(search) {
    this._state = "loading";
    this.requestUpdate("_state");

    try {
      const url = new URL("https://api.ayetu.net/search-users");
      url.searchParams.set("search", search);
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data);

      this._users = data;
      this._state = "idle";
      this.requestUpdate("_users");
    } catch (error) {
      this._state = "error";
      console.log(error);
    } finally {
      this.requestUpdate("_state");
    }
  }
}

customElements.define("search-users", SearchUsers);
