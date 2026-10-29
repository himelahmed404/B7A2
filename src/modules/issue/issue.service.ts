import type { Issue } from "./issue.interface";
import { pool } from "../../db";

const CreateIssueIntoDB = async (payload: Issue) => {
    const { title, description, type, status, reporter_id } = payload;

    const query = await pool.query(
        `
        INSERT INTO issues (title, description, type, status, reporter_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [title, description, type, status || "open", reporter_id]
    );

    return query.rows[0];

}

export const IssueService = {
    CreateIssueIntoDB,
}