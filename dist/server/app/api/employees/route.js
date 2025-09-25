/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/employees/route";
exports.ids = ["app/api/employees/route"];
exports.modules = {

/***/ "(rsc)/./app/api/employees/route.ts":
/*!************************************!*\
  !*** ./app/api/employees/route.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n// This is a temporary in-memory store for demo purposes\n// In a real app, you would use a database\nlet employees = [\n    {\n        id: \"1\",\n        name: \"John Doe\",\n        email: \"john.doe@example.com\",\n        phone: \"08012345678\",\n        address: \"123 Main Street, Lagos\",\n        nin: \"12345678901\",\n        status: \"active\",\n        createdAt: new Date().toISOString(),\n        updatedAt: new Date().toISOString()\n    }\n];\nasync function GET(request) {\n    // In a real app, you would fetch from your database\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(employees);\n}\nasync function POST(request) {\n    try {\n        const data = await request.json();\n        // In a real app, validate the data and save to database\n        const newEmployee = {\n            id: String(employees.length + 1),\n            status: \"active\",\n            createdAt: new Date().toISOString(),\n            updatedAt: new Date().toISOString(),\n            ...data\n        };\n        employees.push(newEmployee);\n        // In a real app, you would send an email here with the password setup link\n        // For now, we'll just return the new employee\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(newEmployee, {\n            status: 201\n        });\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to create employee\"\n        }, {\n            status: 400\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2VtcGxveWVlcy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMEM7QUFJMUMsd0RBQXdEO0FBQ3hELDBDQUEwQztBQUMxQyxJQUFJQyxZQUF3QjtJQUMxQjtRQUNFQyxJQUFJO1FBQ0pDLE1BQU07UUFDTkMsT0FBTztRQUNQQyxPQUFPO1FBQ1BDLFNBQVM7UUFDVEMsS0FBSztRQUNMQyxRQUFRO1FBQ1JDLFdBQVcsSUFBSUMsT0FBT0MsV0FBVztRQUNqQ0MsV0FBVyxJQUFJRixPQUFPQyxXQUFXO0lBQ25DO0NBQ0Q7QUFFTSxlQUFlRSxJQUFJQyxPQUFvQjtJQUM1QyxvREFBb0Q7SUFDcEQsT0FBT2QscURBQVlBLENBQUNlLElBQUksQ0FBQ2Q7QUFDM0I7QUFFTyxlQUFlZSxLQUFLRixPQUFvQjtJQUM3QyxJQUFJO1FBQ0YsTUFBTUcsT0FBTyxNQUFNSCxRQUFRQyxJQUFJO1FBRS9CLHdEQUF3RDtRQUN4RCxNQUFNRyxjQUF3QjtZQUM1QmhCLElBQUlpQixPQUFPbEIsVUFBVW1CLE1BQU0sR0FBRztZQUM5QlosUUFBUTtZQUNSQyxXQUFXLElBQUlDLE9BQU9DLFdBQVc7WUFDakNDLFdBQVcsSUFBSUYsT0FBT0MsV0FBVztZQUNqQyxHQUFHTSxJQUFJO1FBQ1Q7UUFFQWhCLFVBQVVvQixJQUFJLENBQUNIO1FBRWYsMkVBQTJFO1FBQzNFLDhDQUE4QztRQUM5QyxPQUFPbEIscURBQVlBLENBQUNlLElBQUksQ0FBQ0csYUFBYTtZQUFFVixRQUFRO1FBQUk7SUFDdEQsRUFBRSxPQUFPYyxPQUFPO1FBQ2QsT0FBT3RCLHFEQUFZQSxDQUFDZSxJQUFJLENBQ3RCO1lBQUVPLE9BQU87UUFBNEIsR0FDckM7WUFBRWQsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcV2VhbHRoXFxEb2N1bWVudHNcXFByb2plY3RzXFxhdHRlbmRhY2UtdHJhY2tlclxcYXR0VHJhY2tlci1hZG1pblxcYXBwXFxhcGlcXGVtcGxveWVlc1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcclxuaW1wb3J0IHR5cGUgeyBOZXh0UmVxdWVzdCB9IGZyb20gXCJuZXh0L3NlcnZlclwiXHJcbmltcG9ydCB7IEVtcGxveWVlIH0gZnJvbSBcIkAvdHlwZXMvZW1wbG95ZWVcIlxyXG5cclxuLy8gVGhpcyBpcyBhIHRlbXBvcmFyeSBpbi1tZW1vcnkgc3RvcmUgZm9yIGRlbW8gcHVycG9zZXNcclxuLy8gSW4gYSByZWFsIGFwcCwgeW91IHdvdWxkIHVzZSBhIGRhdGFiYXNlXHJcbmxldCBlbXBsb3llZXM6IEVtcGxveWVlW10gPSBbXHJcbiAge1xyXG4gICAgaWQ6IFwiMVwiLFxyXG4gICAgbmFtZTogXCJKb2huIERvZVwiLFxyXG4gICAgZW1haWw6IFwiam9obi5kb2VAZXhhbXBsZS5jb21cIixcclxuICAgIHBob25lOiBcIjA4MDEyMzQ1Njc4XCIsXHJcbiAgICBhZGRyZXNzOiBcIjEyMyBNYWluIFN0cmVldCwgTGFnb3NcIixcclxuICAgIG5pbjogXCIxMjM0NTY3ODkwMVwiLFxyXG4gICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxyXG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICB9LFxyXG5dXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgLy8gSW4gYSByZWFsIGFwcCwgeW91IHdvdWxkIGZldGNoIGZyb20geW91ciBkYXRhYmFzZVxyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihlbXBsb3llZXMpXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxyXG4gICAgXHJcbiAgICAvLyBJbiBhIHJlYWwgYXBwLCB2YWxpZGF0ZSB0aGUgZGF0YSBhbmQgc2F2ZSB0byBkYXRhYmFzZVxyXG4gICAgY29uc3QgbmV3RW1wbG95ZWU6IEVtcGxveWVlID0ge1xyXG4gICAgICBpZDogU3RyaW5nKGVtcGxveWVlcy5sZW5ndGggKyAxKSxcclxuICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxyXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgIC4uLmRhdGEsXHJcbiAgICB9XHJcblxyXG4gICAgZW1wbG95ZWVzLnB1c2gobmV3RW1wbG95ZWUpXHJcblxyXG4gICAgLy8gSW4gYSByZWFsIGFwcCwgeW91IHdvdWxkIHNlbmQgYW4gZW1haWwgaGVyZSB3aXRoIHRoZSBwYXNzd29yZCBzZXR1cCBsaW5rXHJcbiAgICAvLyBGb3Igbm93LCB3ZSdsbCBqdXN0IHJldHVybiB0aGUgbmV3IGVtcGxveWVlXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24obmV3RW1wbG95ZWUsIHsgc3RhdHVzOiAyMDEgfSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IGVycm9yOiBcIkZhaWxlZCB0byBjcmVhdGUgZW1wbG95ZWVcIiB9LFxyXG4gICAgICB7IHN0YXR1czogNDAwIH1cclxuICAgIClcclxuICB9XHJcbn0iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZW1wbG95ZWVzIiwiaWQiLCJuYW1lIiwiZW1haWwiLCJwaG9uZSIsImFkZHJlc3MiLCJuaW4iLCJzdGF0dXMiLCJjcmVhdGVkQXQiLCJEYXRlIiwidG9JU09TdHJpbmciLCJ1cGRhdGVkQXQiLCJHRVQiLCJyZXF1ZXN0IiwianNvbiIsIlBPU1QiLCJkYXRhIiwibmV3RW1wbG95ZWUiLCJTdHJpbmciLCJsZW5ndGgiLCJwdXNoIiwiZXJyb3IiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/employees/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Femployees%2Froute&page=%2Fapi%2Femployees%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Femployees%2Froute.ts&appDir=C%3A%5CUsers%5CWealth%5CDocuments%5CProjects%5Cattendace-tracker%5CattTracker-admin%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CWealth%5CDocuments%5CProjects%5Cattendace-tracker%5CattTracker-admin&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Femployees%2Froute&page=%2Fapi%2Femployees%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Femployees%2Froute.ts&appDir=C%3A%5CUsers%5CWealth%5CDocuments%5CProjects%5Cattendace-tracker%5CattTracker-admin%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CWealth%5CDocuments%5CProjects%5Cattendace-tracker%5CattTracker-admin&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Wealth_Documents_Projects_attendace_tracker_attTracker_admin_app_api_employees_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/employees/route.ts */ \"(rsc)/./app/api/employees/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"export\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/employees/route\",\n        pathname: \"/api/employees\",\n        filename: \"route\",\n        bundlePath: \"app/api/employees/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Wealth\\\\Documents\\\\Projects\\\\attendace-tracker\\\\attTracker-admin\\\\app\\\\api\\\\employees\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Wealth_Documents_Projects_attendace_tracker_attTracker_admin_app_api_employees_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZlbXBsb3llZXMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmVtcGxveWVlcyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmVtcGxveWVlcyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNXZWFsdGglNUNEb2N1bWVudHMlNUNQcm9qZWN0cyU1Q2F0dGVuZGFjZS10cmFja2VyJTVDYXR0VHJhY2tlci1hZG1pbiU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDV2VhbHRoJTVDRG9jdW1lbnRzJTVDUHJvamVjdHMlNUNhdHRlbmRhY2UtdHJhY2tlciU1Q2F0dFRyYWNrZXItYWRtaW4maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9ZXhwb3J0JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzBEO0FBQ3ZJO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxXZWFsdGhcXFxcRG9jdW1lbnRzXFxcXFByb2plY3RzXFxcXGF0dGVuZGFjZS10cmFja2VyXFxcXGF0dFRyYWNrZXItYWRtaW5cXFxcYXBwXFxcXGFwaVxcXFxlbXBsb3llZXNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiZXhwb3J0XCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2VtcGxveWVlcy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2VtcGxveWVlc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZW1wbG95ZWVzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcV2VhbHRoXFxcXERvY3VtZW50c1xcXFxQcm9qZWN0c1xcXFxhdHRlbmRhY2UtdHJhY2tlclxcXFxhdHRUcmFja2VyLWFkbWluXFxcXGFwcFxcXFxhcGlcXFxcZW1wbG95ZWVzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Femployees%2Froute&page=%2Fapi%2Femployees%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Femployees%2Froute.ts&appDir=C%3A%5CUsers%5CWealth%5CDocuments%5CProjects%5Cattendace-tracker%5CattTracker-admin%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CWealth%5CDocuments%5CProjects%5Cattendace-tracker%5CattTracker-admin&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Femployees%2Froute&page=%2Fapi%2Femployees%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Femployees%2Froute.ts&appDir=C%3A%5CUsers%5CWealth%5CDocuments%5CProjects%5Cattendace-tracker%5CattTracker-admin%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CWealth%5CDocuments%5CProjects%5Cattendace-tracker%5CattTracker-admin&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();