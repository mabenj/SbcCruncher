import React from "react";
import { ISolution } from "../interfaces";
import { ISolutionColumnDefinition } from "../interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import { Badge } from "primereact/badge";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Message } from "primereact/message";

import "../styles/Solutions.scss";
import Spinner from "./Spinner";

interface ISolutionsProps {
	displaySolutions: ISolution[];
	targetRating: number | undefined;
	columnDefinitions: ISolutionColumnDefinition[];
	totalSolutionsCount: number | null; // null means that calculation has not started yet
	isCalculating: boolean;
	fetchMoreSolutions: (fromIndex: number) => void;
}

export function Solutions({
	displaySolutions,
	targetRating,
	columnDefinitions,
	totalSolutionsCount,
	isCalculating,
	fetchMoreSolutions
}: ISolutionsProps) {
	const loadingTemplate = () => {
		return isCalculating ? <></> : <Loading />;
	};

	const ratingTemplate = (rating: number) => {
		return <span>{rating}</span>;
	};

	const columns = columnDefinitions
		.map((cd) => {
			return (
				<Column
					key={cd.label}
					field={cd.rating.toString()}
					header={cd.label}
					body={(rowData) => ratingTemplate(rowData.ratings[cd.rating])}
				/>
			);
		})
		.push(
			<Column
				field="price"
				header="Price"
				body={(rowData) => <span>{rowData.price}</span>}
			/>
		);

	return (
		<div className="solutions">
			<h3>
				Solutions{" "}
				{(totalSolutionsCount || 0) > 0 && (
					<Badge value={totalSolutionsCount} />
				)}
			</h3>
			<small>
				Each row in this table shows how many players of each rating you must
				acquire in order to achieve the target rating
				{targetRating && (
					<>
						{" "}
						of <strong>{targetRating}</strong>
					</>
				)}
			</small>

			{/* <DataTable
				value={displaySolutions}
				stripedRows
				virtualScrollerOptions={{
					lazy: true,
					onLazyLoad: isCalculating
						? () => -1
						: () => fetchMoreSolutions(displaySolutions.length),
					showLoader: true,
					loadingTemplate
				}}>
				{columns}
			</DataTable> */}

			{/* <InfiniteScroll
				dataLength={displaySolutions.length}
				next={
					isCalculating
						? () => -1
						: () => fetchMoreSolutions(displaySolutions.length)
				}
				hasMore={
					!isCalculating && (totalSolutionsCount || 0) > displaySolutions.length
				}
				loader={isCalculating ? <></> : <Loading />}
				className="infinite-scroll">
				<Table striped hover responsive="lg" className="p-mt-2 solutions-table">
					<thead className="table-dark sticky-header">
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
			</InfiniteScroll> */}

			{/* <Collapse
				in={
					isCalculating && (totalSolutionsCount || 0) > displaySolutions.length
				}>
				<div>
					<Alert variant="warning">
						Only the cheapest {displaySolutions.length} solutions are shown
						while calculating
					</Alert>
				</div>
			</Collapse>

			<Collapse in={totalSolutionsCount !== null && totalSolutionsCount === 0}>
				<div>
					<Alert variant="danger">
						No possible solutions exist — Try again with a different
						configuration
					</Alert>
				</div>
			</Collapse> */}
		</div>
	);
}

const Loading = () => {
	return (
		<div className="loader-container">
			<Spinner.Ellipsis />
			<h5>Loading...</h5>
		</div>
	);
};

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
	const className = type === "rating" ? "rating-cell" : "price-cell";
	if (isHeader) {
		return <th className={`bg-dark ${className}`}>{value}</th>;
	} else {
		return (
			<td className={className}>
				<span className={value === 0 ? "text-muted" : ""}>{value}</span>
			</td>
		);
	}
};
