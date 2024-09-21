<script>
	// see: https://medium.com/nightingale/making-hierarchy-layouts-with-d3-hierarchy-fdb36d0a9c56
	// and: https://observablehq.com/@sandraviz/d3-hierarchal-data

	// ** ROLLUP **
	// "...lets you “reduce” each group by computing
	// a corresponding summary value, such as a sum or count.
	// The result is a MAP from key to reduced value.
	// Its signature is similar to d3.group’s signature,
	// with an added reducer function as the second argument:
	// rollup(data, reducer, key1, key2…).
	// -- FOR EACH GROUP, the reducer receives the group as an array,
	//    and returns the reduced value." --

	import * as d3 from 'd3';

	const athletes = [
		{ name: 'Floyd Mayweather', sport: 'Boxing', nation: 'United States', earnings: 285 },
		{ name: 'Lionel Messi', sport: 'Soccer', nation: 'Argentina', earnings: 111 },
		{ name: 'Cristiano Ronaldo', sport: 'Soccer', nation: 'Portugal', earnings: 108 },
		{ name: 'Conor McGregor', sport: 'MMA', nation: 'Ireland', earnings: 99 },
		{ name: 'Neymar', sport: 'Soccer', nation: 'Brazil', earnings: 90 },
		{ name: 'LeBron James', sport: 'Basketball', nation: 'United States', earnings: 85.5 },
		{ name: 'Roger Federer', sport: 'Tennis', nation: 'Switzerland', earnings: 77.2 },
		{ name: 'Stephen Curry', sport: 'Basketball', nation: 'United States', earnings: 76.9 },
		{ name: 'Matt Ryan', sport: 'Football', nation: 'United States', earnings: 67.3 },
		{ name: 'Matthew Stafford', sport: 'Football', nation: 'United States', earnings: 59.5 }
	];

	$: gbs = d3.groups(athletes, (d) => d.sport);
	// $: console.log(`Group by SPORTS`, gbs);
  // $: gbs.map(d => console.log(d[0], ': ', d[1].length))

	$: gbsRoll = d3.rollups(
		athletes,
		(ath) => ath.length,
		(d) => d.sport
	);
	// $: console.log(gbsRoll);

	$: gbsRollFric = d3.rollups(
		athletes,
		(tot) => d3.sum(tot, (d) => d.earnings),
		(d) => d.sport
	);
	$: console.log(gbsRollFric);

	const data = [
		{ name: 'jim', amount: '34.0', date: '11/12/2015' },
		{ name: 'carl', amount: '120.11', date: '11/12/2015' },
		{ name: 'carl', amount: '10.31', date: '11/12/2015' },
		{ name: 'stacy', amount: '12.01', date: '01/04/2016' },
		{ name: 'stacy', amount: '1233.01', date: '01/04/2016' },
		{ name: 'stacy', amount: '34.05', date: '01/04/2016' }
	];

	$: groupByName = d3.groups(data, (d) => d.name);
	$: groupByDate = d3.groups(data, (d) => d.date);
	$: groupByGt_100 = d3.groups(data, (d) => d.amount > 100);

	$: groupByNameDate = d3.groups(
		data,
		(d) => d.name,
		(d) => d.date
	);

	$: fistAmountPerEachName = Array.from(
		groupByName,
		//  ([key, value]) => ({ key, value: value[0].amount })
		([key, value]) => ({ key, value })
	);

	$: numberOfItemsPerEachName = d3.rollup(
		data,
		(d) => d.length, // reducerFn
		(d) => d.name // keyToGroupBy
	);

	// $: console.log(`DATA: `, data);
	// $: console.log(`GROUPBYNAME: `, groupByName);
	// $: console.log(`GROUPBYDATE: `, groupByDate)
	// $: console.log(`GROUPBYGT_100: `, groupByGt_100)

	// $: console.log(`GROUPBYNAMEDATE: `, groupByNameDate);

	// $: console.log(`FISTAMOUNTPEREACHNAME: `, fistAmountPerEachName);
	// $: console.log(`numberOfItemsPerEachName: `, numberOfItemsPerEachName);

	$: console.log(1 + 1e-14 - 1);
	// $: console.log(d3.fsum(1 + 1e-14 - 1));
	$: d3.fsum([1, 1e-14, -1]);
</script>
