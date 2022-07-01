import request from "@/utils/request";

export const reqTrademarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });

export const reqAddOrUpdateTrademark = (trademark) => {
  if (trademark.id) {
    return request({
      url: "/admin/product/baseTrademark/update",
      method: "post",
      data: trademark,
    });
  } else {
    return request({
      url: "/admin/product/baseTrademark/save",
      method: "post",
      data: trademark,
    });
  }
};
export const reqDeleteTrademark = (id) =>
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: "delete",
  });
