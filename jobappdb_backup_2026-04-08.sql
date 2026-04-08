--
-- PostgreSQL database dump
--

\restrict CoZwISLsUOK5XPvzYsn4DB65ZNwUak9eDRYeW6SktS0AItFe1MRj1w1dFuIM7hh

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_applications (
    id uuid NOT NULL,
    company_name character varying(255) NOT NULL,
    job_title character varying(255) NOT NULL,
    job_description text,
    job_url character varying(255),
    status character varying(255),
    resume_filename character varying(255),
    notes text,
    applied_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    location character varying(255)
);


ALTER TABLE public.job_applications OWNER TO postgres;

--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
b91e6d50c006
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_applications (id, company_name, job_title, job_description, job_url, status, resume_filename, notes, applied_at, updated_at, location) FROM stdin;
400dcad7-d661-4376-b2a5-9a37ea05b0f2	Munjal Chakraborty Softwares And Media Pvt Ltd	Ethical Hacker	\N	https://mcsam.in/	Applied	e0bb42bd_muhammed_safvan_Ethical_Hacker_Munjal Chakraborty Softwares And Media Pvt Ltd.pdf	\N	2026-03-25 17:11:19.375864+00	2026-03-25 17:11:19.375864+00	Haryana
79d96ac0-2228-4ec7-92d0-cc444c052981	netrika	Cyber Security Analyst		https://www.netrika.com/	Applied	b3697cdd_muhammed_safvan_JAnalyst - Cyber Security_Netrika, Consulting and Investigations.pdf		2026-03-25 17:27:05.713303+00	2026-03-25 17:27:18.800727+00	Mumbai
93e3c9dc-47b2-4d1a-88ad-f63ad9a01430	TechDefence Labs	Security Analyst - VAPT	\N	https://in.indeed.com/cmp/Techdefence-Labs?campaignid=mobvjcmp&from=mobviewjob&tk=1jkj17d9ohbmq80s&fromjk=d6b6c8181a0bc572	Applied	a99022c1_muhammed_safvan_Security Analyst – VAPT_TechDefence Labs.pdf	\N	2026-03-25 17:45:02.562457+00	2026-03-25 17:45:02.562457+00	Delhi
6eaa4713-0d0a-42f5-bc0d-b3c232c1e8de	Transact Campus	Information Security Analyst	\N	https://in.indeed.com/cmp/Transact-Campus?campaignid=mobvjcmp&from=mobviewjob&tk=1jkj1j7u2h86a801&fromjk=44f72d9ed45f89b5	Applied	00b34d21_muhammed_safvan_Information Security Analyst.pdf	\N	2026-03-25 17:49:42.874844+00	2026-03-25 17:49:42.874844+00	Remote
2374ccbf-b57e-427b-9483-02dd45eca4ad	Retransform	Cyber Security Analyst	\N	https://www.retransform.com/jobs/cyber-security-analyst/	Applied	1a4af68f_muhammed_safvan_Cyber_security_analyst_Retransform.pdf	\N	2026-03-25 17:56:11.789064+00	2026-03-25 17:56:11.789064+00	Chennai
a8f96818-8c2d-4cc9-ba6a-ec4eb7a1aeb8	noviindus	Python Developer	\N	https://crmnoviindus.com/	Applied	08757186_muhammed_safvan_python_backend_developer_noviindus.pdf	\N	2026-03-27 16:57:47.074871+00	2026-03-27 16:57:47.074871+00	Kozhikode
f59b4ec1-1f10-459c-8a61-66dd43fba490	Digicom Technology Solutions	Cyber Security Engineer		https://www.dtsit.com/	Rejected	9bf0be68_muhammed_safvan_Cybersecurity Engineer_Digicom Technology Solutions.pdf		2026-03-25 17:37:32.816207+00	2026-03-28 15:00:04.069907+00	Remote
6ce2db12-d731-46e8-85b0-52e303264ff1	webandcrafts	Software Engineer - Python		https://webandcrafts.com/	Applied	93ac4eb7_muhammed_safvan_software_developer_webandcrafts.pdf		2026-03-27 17:06:12.720263+00	2026-03-28 15:00:15.136664+00	Thirssur
10a45629-60fb-4ae2-a493-50fab38c81a3	Delta Institutions	Python Backend Developer		https://deltainstitutions.com/	Rejected	7b9c412e_safvan_python_backend_engineer.pdf		2026-03-25 16:38:22.336706+00	2026-03-30 13:38:28.883259+00	Kochi
78500522-3d75-44b6-b072-f21d336cbab6	Skynet Secure Solutions	Cyber Security Analyst		https://www.skynetsecure.com/	Under Review	\N		2026-03-25 16:47:08.552092+00	2026-03-30 13:39:29.567437+00	Maharashtra
7ff31e21-44ae-4e74-bcce-9718e860f1de	endava	Junior Cyber Security Analyst - Tier 1		https://www.endava.com/	Under Review	8b2c7016_muhammed_safvan_Junior Cyber Security Analyst - Tier 1_ Envada.pdf		2026-03-25 17:21:21.064005+00	2026-03-30 13:45:23.937373+00	Bengaluru
\.


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: ix_job_applications_applied_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_job_applications_applied_at ON public.job_applications USING btree (applied_at);


--
-- Name: ix_job_applications_updated_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_job_applications_updated_at ON public.job_applications USING btree (updated_at);


--
-- PostgreSQL database dump complete
--

\unrestrict CoZwISLsUOK5XPvzYsn4DB65ZNwUak9eDRYeW6SktS0AItFe1MRj1w1dFuIM7hh

