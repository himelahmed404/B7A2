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

  const issues = `
    SELECT * FROM issues
    WHERE type = COALESCE($1, type)
      AND status = COALESCE($2, status)
    ORDER BY created_at ${order};
  `;

  const result = await pool.query(issues, [type || null, status || null]);

  const userIds = result.rows.map((issue) => issue.reporter_id);
  const usersQuery = await pool.query(
    `
        SELECT id, username AS name, role FROM users WHERE id = ANY($1);
      `,
    [userIds],
  );

  const usersMap = new Map(usersQuery.rows.map((user) => [user.id, user]));

  result.rows.forEach((issue) => {
    issue.reporter = usersMap.get(issue.reporter_id) || null;
  });
  return result.rows;
};

const GetIssueByIdFromDB = async (issueId: string) => {
  const issue = await pool.query(
    `
        SELECT * FROM issues WHERE id = $1;
        `,
    [issueId],
  );

  if (issue.rows.length === 0) return null;

  const userOfIssue = await pool.query(
    `
        SELECT id, username AS name, role FROM users WHERE id = $1;
        `,
    [issue.rows[0].reporter_id],
  );

  const reporter = userOfIssue.rows[0] || null;

  return {
    ...issue.rows[0],
    reporter,
  };
};

const UpdateIssueInDB = async (issueId: string, payload: Partial<Issue>) => {
  const { title, description, type } = payload;
  const query = await pool.query(
    `
        UPDATE issues
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            type = COALESCE($3, type),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *;
        `,
    [title || null, description || null, type || null, issueId],
  );

  return query.rows[0];
};

export const IssueService = {
  GetAllIssuesFromDB,
  CreateIssueIntoDB,
  GetIssueByIdFromDB,
  UpdateIssueInDB,
};
