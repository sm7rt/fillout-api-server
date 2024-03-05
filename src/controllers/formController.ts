import { Request, Response } from "express";
import axios from "axios";

export const getFilteredResponses = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const {
      limit,
      afterDate,
      beforeDate,
      offset,
      status,
      includeEditLink,
      sort,
      filters,
    } = req.query;
    const API_KEY = process.env.FILL_OUT_API_KEY;
    const url = `https://api.fillout.com/v1/api/forms/${formId}/submissions`;

    const params = {
      limit,
      afterDate,
      beforeDate,
      offset,
      status,
      includeEditLink,
      sort,
    };

    const response = await axios.get(url, {
      params,
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const filteredResponses = filterResponses(
      response.data.responses,
      JSON.parse(filters as string)
    );

    res.json({
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: 1,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

function filterResponses(responses: any[], filters: any[]): any[] {
  return responses.filter((response) => {
    return filters.every((filter) => {
      const question = response.questions.find((q: any) => q.id === filter.id);
      if (!question) return false;

      switch (filter.condition) {
        case "equals":
          return question.value === filter.value;
        case "does_not_equal":
          return question.value !== filter.value;
        case "greater_than":
          return new Date(question.value) > new Date(filter.value);
        case "less_than":
          return new Date(question.value) < new Date(filter.value);
        default:
          return false;
      }
    });
  });
}
