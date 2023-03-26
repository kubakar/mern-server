import express, { RequestHandler } from "express";

export const createJob: RequestHandler = async (req, res) => {
  res.send("createJob");
};

export const deleteJob: RequestHandler = async (req, res) => {
  res.send("deleteJob");
};

export const getAllJobs: RequestHandler = async (req, res) => {
  res.send("getAllJobs");
};

export const updateJob: RequestHandler = async (req, res) => {
  res.send("updateJob");
};

export const showStats: RequestHandler = async (req, res) => {
  res.send("showStats");
};
