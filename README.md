![SBC Cruncher banner](public/images/banner_low.png)

<h1 align="center">SBC Cruncher</h1>

<p align="center">Calculate the cheapest combination of player ratings for Ultimate Team SBC solutions</p>

<p align="center">
   <a style="text-decoration:none" href="https://app.netlify.com/sites/sbccruncher/deploys" target="_blank">
    <img src="https://api.netlify.com/api/v1/badges/315ab81c-01ff-4ee7-bccd-c0cc092b7ad2/deploy-status" alt="Netlify Status" />
  </a>
  <a style="text-decoration:none" href="https://play.google.com/store/apps/details?id=cc.sbccruncher.twa" target="_blank">
    <img src="https://img.shields.io/badge/Google%20Play-Download-success" alt="Google play" />
  </a>
</p>

## Introduction

[SBC Cruncher](https://sbccruncher.cc) is a website that helps you find the cheapest player ratings to reach a specific target rating in FIFA (EA Sports FC) Ultimate Team. This is particularly useful for completing [SBC](https://www.futbin.com/squad-building-challenges)s, as it allows you to specify the ratings of the players you already have and plan to use in the SBC (aka, fodder). It also has the capability to automatically retrieve player rating prices from Futbin and Futwiz, removing the need for manual input of prices for each rating.

## How it works

_tl;dr brute force_

1. Given the existing player ratings and the range of ratings to try, all possible combinations of these ratings are computed. In other words, all possible teams made up of the existing ratings plus all the possible _multisubsets_ (unordered sets with repetition of elements) of the ratings to try.
2. All rating combinations that have a rating lower than the target are then filtered out.
3. Lastly, each combination of ratings is assigned a price based on the user or Futbin-defined prices, after which, it is only a matter of displaying the cheapest combinations of ratings.

See [solver.worker.ts](src/workers/solver.worker.ts) for more details.

## Tech used

-   Next.js, TypeScript
-   MongoDB, Mongoose
-   Web Workers
-   Chakra UI
