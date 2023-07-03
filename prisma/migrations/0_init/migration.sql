-- CreateTable
CREATE TABLE "insurance_policy" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "insurance_agent_id" UUID,
    "policy_name" VARCHAR(255) NOT NULL,
    "policy_details" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insurance_policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_inventory" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "pharmacy_staff_id" UUID,
    "medicine_name" VARCHAR(255) NOT NULL,
    "medicine_details" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicine_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "description" VARCHAR(255),
    "image" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_record" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "medical_staff_id" UUID,
    "patient_name" VARCHAR(255) NOT NULL,
    "patient_details" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "insurance_policy" ADD CONSTRAINT "insurance_policy_insurance_agent_id_fkey" FOREIGN KEY ("insurance_agent_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "medicine_inventory" ADD CONSTRAINT "medicine_inventory_pharmacy_staff_id_fkey" FOREIGN KEY ("pharmacy_staff_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_record" ADD CONSTRAINT "patient_record_medical_staff_id_fkey" FOREIGN KEY ("medical_staff_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

