import React from "react";
import { API, graphqlOperation } from "aws-amplify";
// import { searchMarkets } from "../graphql/queries";
import NewMarket from "../components/NewMarket";
import MarketList from "../components/MarketList";

const searchMarkets = `query SearchMarkets(
  $filter: SearchableMarketFilterInput
  $sort: SearchableMarketSortInput
  $limit: Int
  $nextToken: Int
) {
  searchMarkets(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      products {
        items {
          id
        }
        nextToken
      }
      tags
      owner
      createdAt
    }
    nextToken
  }
}
`;

class HomePage extends React.Component {
  state = {
    searchTerm: "",
    searchResults: [],
    isSearching: false

  };

  handleSearchChange = searchTerm => this.setState({ searchTerm });

  handleClearSearch = () => this.setState({ searchTerm: "", searchResults: [] });

  handleSearch = async event => {
    try {
      event.preventDefault();
      const result = await API.graphql(graphqlOperation(searchMarkets, {
        filter: {
          or: [
            { name: { match: this.state.searchTerm } },
            { owner: { match: this.state.searchTerm } },
            { tags: { match: this.state.searchTerm } },
          ]
        },
        sort: {
          field: "createdAt",
          direction: "desc"
        }
      }));
      console.log(result);
      this.setState({
        searchResults: result.data.searchMarkets.items,
        isSearching: false
      })
    } catch(err) {
      console.error(err)
    }
  }

  render() {
    return (
      <>
        <NewMarket 
          searchTerm={this.state.searchTerm}
          isSearching={this.state.isSearching}
          handleSearchChange={this.handleSearchChange}
          handleClearSearch={this.handleClearSearch}
          handleSearch={this.handleSearch}
        />
        <MarketList searchResults={this.state.searchResults} />
      </>
    )
  }
}

export default HomePage;
