import { normalizeHostnameForComparison, isSameDomain, isSameSubdomain } from "../../lib/validateUrl";
import { normalizeUrlOnlyHostname } from "../../lib/canonical-url";
import { url } from "../../controllers/v1/types";

test("normalizeHostnameForComparison should normalize Punycode domains correctly", () => {
  expect(normalizeHostnameForComparison("xn--1lqv92a901a.xn--ses554g")).toBe("xn--1lqv92a901a.xn--ses554g");
  expect(normalizeHostnameForComparison("www.xn--1lqv92a901a.xn--ses554g")).toBe("xn--1lqv92a901a.xn--ses554g");
});

test("normalizeHostnameForComparison should handle regular domains", () => {
  expect(normalizeHostnameForComparison("example.com")).toBe("example.com");
  expect(normalizeHostnameForComparison("www.example.com")).toBe("example.com");
});

test("normalizeHostnameForComparison should handle invalid hostnames gracefully", () => {
  expect(normalizeHostnameForComparison("invalid..hostname")).toBe("invalid..hostname");
  expect(normalizeHostnameForComparison("www.invalid..hostname")).toBe("invalid..hostname");
});

test("isSameDomain should recognize same IDN domains", () => {
  expect(isSameDomain("http://xn--1lqv92a901a.xn--ses554g", "https://xn--1lqv92a901a.xn--ses554g")).toBe(true);
  expect(isSameDomain("http://www.xn--1lqv92a901a.xn--ses554g", "https://xn--1lqv92a901a.xn--ses554g")).toBe(true);
});

test("isSameDomain should recognize different IDN domains", () => {
  expect(isSameDomain("http://xn--1lqv92a901a.xn--ses554g", "https://xn--fsq.xn--0zwm56d")).toBe(false);
});

test("isSameDomain should handle IDN subdomains correctly", () => {
  expect(isSameDomain("http://sub.xn--1lqv92a901a.xn--ses554g", "https://xn--1lqv92a901a.xn--ses554g")).toBe(true);
  expect(isSameDomain("http://api.xn--1lqv92a901a.xn--ses554g", "https://blog.xn--1lqv92a901a.xn--ses554g")).toBe(true);
});

test("isSameSubdomain should recognize same IDN subdomains", () => {
  expect(isSameSubdomain("http://api.xn--1lqv92a901a.xn--ses554g", "https://api.xn--1lqv92a901a.xn--ses554g")).toBe(true);
  expect(isSameSubdomain("http://www.api.xn--1lqv92a901a.xn--ses554g", "https://api.xn--1lqv92a901a.xn--ses554g")).toBe(true);
});

test("isSameSubdomain should recognize different IDN subdomains", () => {
  expect(isSameSubdomain("http://api.xn--1lqv92a901a.xn--ses554g", "https://blog.xn--1lqv92a901a.xn--ses554g")).toBe(false);
});

test("normalizeUrlOnlyHostname should normalize IDN hostnames correctly", () => {
  expect(normalizeUrlOnlyHostname("http://xn--1lqv92a901a.xn--ses554g/path")).toBe("xn--1lqv92a901a.xn--ses554g");
  expect(normalizeUrlOnlyHostname("https://www.xn--1lqv92a901a.xn--ses554g/path")).toBe("xn--1lqv92a901a.xn--ses554g");
});

test("normalizeUrlOnlyHostname should handle various IDN formats", () => {
  expect(normalizeUrlOnlyHostname("http://xn--fsq.xn--0zwm56d")).toBe("xn--fsq.xn--0zwm56d");
  expect(normalizeUrlOnlyHostname("https://xn--mgbh0fb.xn--kgbechtv/page")).toBe("xn--mgbh0fb.xn--kgbechtv");
});

test("URL validation should accept Chinese IDN domains", () => {
  expect(() => url.parse("http://xn--1lqv92a901a.xn--ses554g")).not.toThrow();
  expect(() => url.parse("https://xn--fsq.xn--0zwm56d")).not.toThrow();
});

test("URL validation should accept Arabic IDN domains", () => {
  expect(() => url.parse("http://xn--mgbh0fb.xn--kgbechtv")).not.toThrow();
  expect(() => url.parse("https://xn--wgbl6a.xn--mgberp4a5d4ar")).not.toThrow();
});

test("URL validation should accept Russian IDN domains", () => {
  expect(() => url.parse("http://xn--e1afmkfd.xn--p1ai")).not.toThrow();
  expect(() => url.parse("https://xn--d1acpjx3f.xn--p1ai")).not.toThrow();
});

test("URL validation should accept IDN domains with complex paths", () => {
  expect(() => url.parse("http://xn--1lqv92a901a.xn--ses554g/path/to/resource?param=value#section")).not.toThrow();
  expect(() => url.parse("https://api.xn--fsq.xn--0zwm56d/v1/endpoint")).not.toThrow();
});

test("URL validation should accept mixed IDN and regular subdomains", () => {
  expect(() => url.parse("http://en.xn--1lqv92a901a.xn--ses554g")).not.toThrow();
  expect(() => url.parse("https://www.xn--fsq.xn--0zwm56d")).not.toThrow();
  expect(() => url.parse("http://api-v2.xn--mgbh0fb.xn--kgbechtv")).not.toThrow();
});
