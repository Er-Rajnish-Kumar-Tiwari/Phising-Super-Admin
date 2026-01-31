import { DELETE, GET, POST } from "@/lib/AxiosClient";
import * as ROUTES from "../routes";

export const getHumanRiskById = (data: { id: string }) =>
  GET({
    url: `${ROUTES.AUTH_URL}/campaign/top-five-scores/${data.id}`,
  }).then((res) => res.data);

export const getOverviewById = (data: { id: string }) =>
  GET({
    url: `${ROUTES.AUTH_URL}/comapny-users/dashboard/${data.id}`,
  }).then((res) => res.data);

export const getMonthlyTrend = (data: { id: string }) =>
  GET({
    url: `${ROUTES.AUTH_URL}/tracking/monthly-click-Rate/${data.id}`,
  }).then((res) => res.data);

  export const getRecentCampaign= (data: { id: string }) =>
    GET({
      url: `${ROUTES.AUTH_URL}/campaign/get-Recent-campaign/${data.id}`,
    }).then((res) => res.data);


    //super admin 
    export const getRecent= () =>
    GET({
      url: `${ROUTES.AUTH_URL}/dashboard/stats`,
    }).then((res) => res.data);

  export const exportTextFile = (data: {userId:string}) =>
    GET({
      url: `${ROUTES.AUTH_URL}/dashboard/campaigns/download?userId=${data.userId}`,
      responseType: "blob",
    }).then((res) => res.data);
