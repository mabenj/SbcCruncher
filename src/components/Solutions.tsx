import React from "react";
import Badge from "react-bootstrap/Badge";
import ISolution from "../interfaces/Solution.interface";
import Table from "react-bootstrap/Table";
import ISolutionColumnDefinition from "../interfaces/SolutionColumnDefinition.interface";
import Alert from "react-bootstrap/Alert";

const style: React.CSSProperties = {
	minHeight: "1000px"
};

const AMOUNT_TO_DISPLAY = 50;

interface ISolutionsProps {
	solutions: ISolution[] | null;
	targetRating: number | undefined;
	columnDefinitions: ISolutionColumnDefinition[];
}

export default function Solutions({
	solutions,
	targetRating,
	columnDefinitions
}: ISolutionsProps) {
	// If solutions are null, it means that no attempt to calculate them has yet been made
	// However, if their length is 0, it means that no valid solution exists
	const noSolutions = solutions !== null && solutions.length === 0;
	solutions = solutions === null ? [] : solutions;
	return (
		<div style={style}>
			<h3>
				Solutions{" "}
				{solutions.length > 0 && <Badge bg="success">{solutions.length}</Badge>}
			</h3>
			<small className="text-muted mb-4">
				Each row in this table shows how many players of each rating you must
				acquire in order to achieve the target rating
				{targetRating && (
					<>
						{" "}
						of <strong>{targetRating}</strong>
					</>
				)}
			</small>

			<Table striped hover responsive="lg">
				<thead className="table-dark">
					<tr>
						{columnDefinitions.map((cd, index) => (
							<RatingCell key={index} isHeader value={cd.label} />
						))}
						<PriceCell value="Price" isHeader />
					</tr>
				</thead>
				<tbody>
					{solutions.slice(0, AMOUNT_TO_DISPLAY).map((solution) => (
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
					{solutions.length === 0 && (
						<tr>
							{columnDefinitions.map((_, index) => (
								<RatingCell key={index} value={0} />
							))}
							<PriceCell value={0} />
						</tr>
					)}
				</tbody>
			</Table>
            
			{solutions.length > AMOUNT_TO_DISPLAY && (
				<Alert variant="warning">
					Only the cheapest {AMOUNT_TO_DISPLAY} solutions are shown
				</Alert>
			)}

			{noSolutions && (
				<Alert variant="danger">
					No possible solutions exist — Try again with a different configuration
				</Alert>
			)}
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
