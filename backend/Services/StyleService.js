import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getStyleList() {
  return (req, res) => {};
}

function postStyle() {
  return (req, res) => {
    try {
      const data = req.body;
      const style = prisma.style.create({
        data,
      });
      res.status(201).json(style);
    } catch (e) {
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function putStyle() {
  return (req, res) => {
    try {
      const data = req.body;
      const { id } = req.params;
      const style = prisma.style.update({
        where: {
          id,
        },
        data,
      });
      res.status(200).json(style);
    } catch (e) {
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function deleteStyle() {
  return (req, res) => {
    try {
      const { id } = req.params;
    } catch (e) {}
  };
}
