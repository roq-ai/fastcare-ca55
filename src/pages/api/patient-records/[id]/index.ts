import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { patientRecordValidationSchema } from 'validationSchema/patient-records';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.patient_record
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPatientRecordById();
    case 'PUT':
      return updatePatientRecordById();
    case 'DELETE':
      return deletePatientRecordById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPatientRecordById() {
    const data = await prisma.patient_record.findFirst(convertQueryToPrismaUtil(req.query, 'patient_record'));
    return res.status(200).json(data);
  }

  async function updatePatientRecordById() {
    await patientRecordValidationSchema.validate(req.body);
    const data = await prisma.patient_record.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePatientRecordById() {
    const data = await prisma.patient_record.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
