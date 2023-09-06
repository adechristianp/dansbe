import axios from "axios";
import lodash from 'lodash';

export const getPositions = async (req, res) => {
    const perPage = 5;
    const page = req?.query?.page || undefined;
    const description = req?.query?.description || "";
    const location = req?.query?.location || "";
    const full_time = req?.query?.full_time == true ? "Full Time" : "";
    // console.log("req.query", req.query)
    // console.log("page", page)
    // console.log("description", description)
    // console.log("location", location)
    // console.log("full_time", full_time)

    axios.get('http://dev3.dansmultipro.co.id/api/recruitment/positions.json').then(response => {
        const allData = response.data;
        const filter = allData
        .filter(e => e.location.toUpperCase().includes(location.toUpperCase()))
        .filter(e => e.type.toUpperCase().includes(full_time.toUpperCase()))
        .filter(e => e.title.toUpperCase().includes(description.toUpperCase()) || e.description.toUpperCase().includes(description.toUpperCase()) || e.company.toUpperCase().includes(description.toUpperCase()));
        const newData = lodash.chunk(filter, perPage);
        res.status(200).json({
            status: "success",
            data: {
                page: page || "-",
                totalPages: newData.length === 0 ? 1 : newData.length,
                totalRecords: filter.length,
                positions: filter.length === 0 ? [] : page ? newData[page-1] : filter,
            }
        })
    }).catch(err => {
        console.error(err);
    });
}