import React from "react";
import Badge from "react-bootstrap/Badge";
import ISolution from "../interfaces/Solution.interface";
import Table from "react-bootstrap/Table";
import ISolutionColumnDefinition from "../interfaces/SolutionColumnDefinition.interface";
import Alert from "react-bootstrap/Alert";
import Collapse from "react-bootstrap/Collapse";

const style: React.CSSProperties = {
	minHeight: "1000px"
};

interface ISolutionsProps {
	displaySolutions: ISolution[];
	targetRating: number | undefined;
	columnDefinitions: ISolutionColumnDefinition[];
	totalSolutionsCount: number | null; // null means calculation has not been done yet
}

export default function Solutions({
	displaySolutions,
	targetRating,
	columnDefinitions,
	totalSolutionsCount
}: ISolutionsProps) {
	return (
		<div style={style}>
			<h3>
				Solutions{" "}
				{totalSolutionsCount !== null && (
					<Badge bg={totalSolutionsCount === 0 ? "danger" : "success"}>
						{totalSolutionsCount}
					</Badge>
				)}
			</h3>
			<small className="text-muted">
				Each row in this table shows how many players of each rating you must
				acquire in order to achieve the target rating
				{targetRating && (
					<>
						{" "}
						of <strong>{targetRating}</strong>
					</>
				)}
			</small>

			<Table striped hover responsive="lg" className="mt-2">
				<thead className="table-dark">
					<tr>
						{columnDefinitions.map((cd, index) => (
							<RatingCell key={index} isHeader value={cd.label} />
						))}
						<PriceCell value="Price" isHeader />
					</tr>
				</thead>
				<tbody>
					{displaySolutions.map((solution) => (
						<tr key={solution.id}>
							{columnDefinitions.map((columnDefinition, columnIndex) => (
								<RatingCell
									key={`row${solution.id}col${columnIndex}`}
									value={
										solution.ratings.filter(
											(rating) => rating === columnDefinition.rating
										).length
									}
								/>
							))}
							<PriceCell value={solution.price} />
						</tr>
					))}
					{displaySolutions.length === 0 && (
						<tr>
							{columnDefinitions.map((_, index) => (
								<RatingCell key={index} value={0} />
							))}
							<PriceCell value={0} />
						</tr>
					)}
				</tbody>
			</Table>

			{totalSolutionsCount !== null &&
				totalSolutionsCount > displaySolutions.length && (
					<Alert variant="warning">
						Only the cheapest {displaySolutions.length} solutions are shown
					</Alert>
				)}

			<Collapse in={totalSolutionsCount === 0}>
				<div>
					<Alert variant="danger">
						No possible solutions exist — Try again with a different
						configuration
					</Alert>
				</div>
			</Collapse>
		</div>
	);
}

const PriceCell = ({
	isHeader = false,
	value
}: {
	isHeader?: boolean;
	value: number | string;
}) => {
	return <Cell type="price" isHeader={isHeader} value={value} />;
};

const RatingCell = ({
	isHeader = false,
	value
}: {
	isHeader?: boolean;
	value: number | string;
}) => {
	return <Cell type="rating" isHeader={isHeader} value={value} />;
};

const Cell = ({
	type,
	isHeader,
	value
}: {
	type: "rating" | "price";
	isHeader: boolean;
	value: string | number;
}) => {
	const style: React.CSSProperties = {
		textAlign: type === "rating" ? "center" : "right"
	};
	const headerStyle: React.CSSProperties = {
		...style,
		borderBottom: "none",
		position: "sticky",
		top: 0
	};
	if (isHeader) {
		return (
			<th className="bg-dark" style={headerStyle}>
				{value}
			</th>
		);
	} else {
		return (
			<td style={style}>
				<span className={value === 0 ? "text-muted" : ""}>{value}</span>
			</td>
		);
	}
};
