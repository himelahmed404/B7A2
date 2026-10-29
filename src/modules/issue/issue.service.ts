import type { Issue } from "./issue.interface";
import { pool } from "../../db";
import type { Query } from "../../types";

const CreateIssueIntoDB = async (payload: Issue) => {
  const { title, description, type, status, reporter_id } = payload;

  const query = await pool.query(
    `
        INSERT INTO issues (title, description, type, status, reporter_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
    [title, description, type, status || "open", reporter_id],
  );

  return query.rows[0];
};

const GetAllIssuesFromDB = async (queryParams: Query) => {

  const { type, status, sort } = queryParams;
  const order = sort === "oldest" ? "ASC" : "DESC";

  const query = `
    SELECT * FROM issues
    WHERE type = COALESCE($1, type)
      AND status = COALESCE($2, status)
    ORDER BY created_at ${order};
  `;

  const result = await pool.query(query, [type || null, status || null]);
  return result.rows;
};

export const IssueService = {
  GetAllIssuesFromDB,
  CreateIssueIntoDB,
};
