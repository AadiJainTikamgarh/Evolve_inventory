import { componentCategory } from "../constants/constants.js";
import { Components } from "../models/component.model.js";
import { ApiError } from "../utils/ApiError.js";

const createComponentService = async (
  name,
  image,
  description,
  props,
  remark,
  category
) => {
  if (
    !name ||
    !image ||
    !category ||
    !Array.isArray(props) ||
    props.length === 0
  ) {
    throw new ApiError(404, "Required fields are missing or invalid");
  }

  const component = await Components.create({
    name,
    image,
    description: description ?? "",
    props,
    remark: remark ?? "",
    category,
  });

  console.log(component);
  return component;
};

const updateComponentService = async (id, props, remark) => {
  if (!id || !props || !remark) {
    throw new ApiError(404, "All fields are required");
  }

  const component = await Components.findById(id);

  component.props = props;
  component.remark = remark;

  await component.save({ validateBeforeSave: false });

  const updatedComponent = await Components.findById(id);

  return updatedComponent;
};

const deleteComponentService = async (id) => {
  if (!id) {
    throw new Error("Id is required");
  }

  await Components.findByIdAndDelete(id);
};

const getComponentWithCategoryService = async (category) => {
  if (!Object.values(componentCategory).includes(category)) {
    throw new ApiError(404, "Invalid category");
  }

  const components = await Components.find({ category });

  return components;
};

const autocompleteComponentsService = async (query, limit = 5) => {
  if (!query) {
    throw new ApiError(404, "Query is required");
  }
  const result = await Components.aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query,
          path: "name",
          fuzzy: {
            maxEdits: 1,
          },
        },
      },
    },
    { $limit: limit },
  ]);

  return result;
};

const searchComponentsWithPaginationService = async (
  query,
  page = 1,
  limit = 10
) => {
  if (!query) {
    throw new ApiError(404, "Query is required");
  }
  const skip = (page - 1) * limit;

  const result = await Components.aggregate([
    {
      $search: {
        index: "default",
        compound: {
          should: [
            {
              autocomplete: {
                query,
                path: "name",
                fuzzy: { maxEdits: 1 },
              },
            },
            {
              text: {
                query,
                path: ["name", "description", "category"],
              },
            },
          ],
        },
      },
    },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  return {
    data: result[0].data, // full documents
    total: result[0].totalCount[0]?.count || 0,
    page,
    limit,
  };
};

const getComponentByIdService = async (id) => {
  if (!id) {
    throw new Error(400, "All fields are required");
  }

  const component = await Components.findById(id);

  return component;
};

export {
  createComponentService,
  updateComponentService,
  deleteComponentService,
  getComponentByIdService,
  getComponentWithCategoryService,
  autocompleteComponentsService,
  searchComponentsWithPaginationService,
};
