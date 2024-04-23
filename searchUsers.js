import "./styles.css";

import { LitElement, css, html } from "lit";
import { debounce } from "./utils";
import { createRef, ref } from "lit/directives/ref.js";

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

    .search-box {
      position: relative;
      height: 52px;
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1px solid #e9e9e9;
      border-radius: 16px;
      padding: 0 12px;
      transition: border-color 0.2s ease;
    }
    .search-box:focus-within {
      border-color: #cecece;
    }

    .search-box > svg {
      width: 20px;
      height: 20px;
      color: #cecece;
    }
    .search-box > svg.close {
      cursor: pointer;
    }

    .search-box > input {
      border: none;
      height: 100%;
      flex-grow: 1;
      font-size: 14px;
      padding: 0 4px;
    }
    .search-box > input:focus {
      outline: none;
    }

    .search-box > div {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      left: 0;
      border: 1px solid #cecece;
      border-radius: 16px;
      overflow: hidden;
    }
    .search-box > div.hidden {
      display: none;
    }

    .user-item-list {
      list-style-type: none;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .user-item-list > * + * {
      border-top: 1px solid #cecece;
      border-bottom: 0;
    }
    .user-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      font-size: 14px;
    }
    .user-item:hover {
      background-color: #f8f8f8;
    }
    .user-item > img {
      border: 1px solid #cecece;
      border-radius: 50%;
      width: 36px;
      height: 36px;
    }
    .user-item > div {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
    }
    .user-item .user-item-handle {
      font-style: italic;
      font-size: 12px;
    }

    .empty {
      padding: 24px 12px;
      font-weight: 400;
      font-size: 14px;
      color: gray;
      text-align: center;
    }
  `;

  static properties = {
    _users: { state: true },
    _search: { state: true },
  };

  constructor() {
    super();
    this._search = "";
    this._users = [];
    this._state = "idle";
    this._error_text = undefined;

    this.searchUsers = debounce(this.searchUsers.bind(this), 500);
    this._onFocusOutside = this._onFocusOutside.bind(this);
  }

  _onFocusOutside(e) {
    const isClickInside = this.contains(e.target);
    if (!isClickInside) {
      this._state = "idle";
      this.requestUpdate("_state");
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("click", this._onFocusOutside);
  }

  disconnectedCallback() {
    window.addEventListener("click", this._onFocusOutside);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <form class="search-box">
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
          .value="${this._search}"
          @input="${this.handleSearch}"
          type="text"
          name="search"
          placeholder="Search users"
        />
        <svg
          @click="${() => {
            this._search = ""
            this._state = "idle"
          }}"
          class="close"
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
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>

        <div class="${this._state === "idle" ? "hidden" : ""}">
          ${this.renderUsers()}
        </div>
      </form>
    `;
  }

  renderUsers() {
    if (this._state === "error") {
      return html`
        <p class="empty">${this._error_text || "Something went wrong!"}</p>
      `;
    }
    if (!this._users.length) {
      return html` <p class="empty">No users found</p> `;
    }
    return html`<ul class="user-item-list">
      ${this._users.map(
        (user) => html`<li class="user-item">
          <img
            src="https://avatar.ayetu.net/${user.cryptoAccounts.ayetu
              .accountName}"
            width="40"
            height="40"
          />
          <div>
            <p class="user-item-name">${user.name}</p>
            <p class="user-item-handle">${user.handle}</p>
          </div>
        </li>`
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
      if (!response.ok) throw new Error(await response.text());

      this._state = "success";
      this._users = await response.json();

      this.requestUpdate("_users");
    } catch (error) {
      this._state = "error";
      this._error_text = error.message;

      this.requestUpdate("_error_text");
    } finally {
      this.requestUpdate("_state");
    }
  }
}

customElements.define("search-users", SearchUsers);
