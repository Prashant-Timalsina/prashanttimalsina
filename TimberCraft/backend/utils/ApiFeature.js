class ApiFeature {
  constructor(query, queryStr) {
    this.query = query; // The MongoDB query object (e.g., Product.find())
    this.queryStr = queryStr; // The query string parameters (e.g., { keyword: "furniture" })
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              name: {
                $regex: this.queryStr.keyword,
                $options: "i", // Case-insensitive search
              },
            },
            {
              description: {
                $regex: this.queryStr.keyword,
                $options: "i", // Case-insensitive search
              },
            },
          ],
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  pagination(resultPerPage) {
    // console.log("Result Per Page:", resultPerPage); // Check value
    if (Number(resultPerPage) === 0) {
      return this; // Skip pagination logic if limit=0
    }
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }

  // Add a method to calculate total pages dynamically
  async getTotalPages(resultPerPage) {
    const totalProducts = await this.query.model.countDocuments(); // Get total product count
    return Math.ceil(totalProducts / resultPerPage); // Total pages calculation
  }
}

export default ApiFeature;
