import Components from "../models/Component.js";
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
    !description ||
    !props.length ||
    !remark ||
    !category
  ) {
    throw new Error("All fields are required");
  }

  const component = await Components.create({
    name,
    image,
    description,
    props,
    remark,
    category,
  });

  return component;
};

const updateComponentService = async (id, props, remark) => {
  if (!id || !props || !remark) {
    throw new ApiError(404, "All fields are required");
  }

  const component = await Components.findByIdAndUpdate(
    id,
    {
      props,
      remark,
    },
    { new: true }
  );

  return component;
};

const deleteComponentService = async (id) => {
  if (!id) {
    throw new Error("Id is required");
  }

  await Components.findByIdAndDelete(id);
};

const getComponentWithCategoryService = async (category) => {
  if (!category.include([Object.values(componentCategory)])) {
    throw new ApiError(404, "Invalid category");
  }

  const components = await Components.find({ category });

  return components;
};

const autocompleteComponentsService = async ({ query, limit = 5 }) => {
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

const searchComponentsWithPaginationService = async ({
  query,
  page = 1,
  limit = 10,
}) => {
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
